import {
  Cubism4ModelSettings,
  Live2DFactory,
  Live2DModel,
  ZipLoader,
} from 'pixi-live2d-display/cubism4'
import JSZip from 'jszip'
import type { Application } from '@pixi/app'
import { fitToScreen } from './config'
import { setupPointerHandling } from '../interaction/pointer'

// ---- ZipLoader 初始化 ----
let zipLoaderReady = false

export function setupZipLoader() {
  if (zipLoaderReady) return
  zipLoaderReady = true

  ZipLoader.zipReader = (data: Blob, _url: string) => JSZip.loadAsync(data)

  const defaultCreateSettings = ZipLoader.createSettings
  ZipLoader.createSettings = async (reader: JSZip) => {
    const filePaths = Object.keys(reader.files)
    let hasModelJson = filePaths.some(f => f.endsWith('.model3.json') || f.endsWith('.model.json'))

    // ---- 获得基础 settings ----
    let settings: Cubism4ModelSettings | undefined
    if (hasModelJson) {
      try {
        settings = await defaultCreateSettings(reader) as any
      } catch (e) {
        console.warn('[loader] defaultCreateSettings failed, falling back to manual setup:', e)
        hasModelJson = false as any // 走下面手动构造分支
      }
    }
    if (!hasModelJson) {
      const mocFiles = filePaths.filter(f => f.endsWith('.moc3'))
      if (mocFiles.length !== 1) throw new Error(`Expected exactly one moc file, got ${mocFiles.length}`)
      const mocFile = mocFiles[0]
      const modelName = mocFile.split(/[\\/]/).pop()!.replace(/\.moc3?/, '')
      const textures = filePaths.filter(f => f.endsWith('.png'))
      if (!textures.length) throw new Error('Textures not found')
      const physics = filePaths.find(f => f.includes('physics'))
      const pose = filePaths.find(f => f.includes('pose'))
      const displayInfo = filePaths.find(f => f.endsWith('.cdi3.json'))

      settings = new Cubism4ModelSettings({
        url: `${modelName}.model3.json`,
        Version: 3,
        FileReferences: {
          Moc: mocFile,
          Textures: textures,
          Physics: physics,
          Pose: pose,
          DisplayInfo: displayInfo,
        },
      }) as Cubism4ModelSettings
      ;(settings as any).name = modelName
      ;(settings as any)._objectURL = `example://${settings.url}`
    }

    // TS 收窄：到这里 settings 一定已赋值
    if (!settings) throw new Error('Failed to create model settings')
    const s = settings  // 收窄类型，此后用 s 替代 settings
    const existingMotionFiles = new Set<string>()
    if (s.motions) {
      for (const group of Object.values(s.motions)) {
        for (const def of (group as any[])) {
          if (def.File) existingMotionFiles.add(def.File)
        }
      }
    }
    const existingExprFiles = new Set<string>()
    if (s.expressions) {
      for (const expr of s.expressions) {
        if (expr.File) existingExprFiles.add(expr.File)
      }
    }

    const looseMotions = filePaths.filter(
      f => (f.endsWith('.mtn') || f.endsWith('.motion3.json')) && !existingMotionFiles.has(f),
    )
    const looseExpressions = filePaths.filter(
      f => f.endsWith('.exp3.json') && !existingExprFiles.has(f),
    )

    // 合并松散 motions
    if (looseMotions.length) {
      const motionDefs: Record<string, any[]> = (s.motions ?? {}) as Record<string, any[]>
      for (const m of looseMotions) {
        const name = m.replace(/\.(mtn|motion3\.json)$/, '').split(/[\\/]/).pop()!
        motionDefs[name] = [{ File: m, FadeInTime: 0.5, FadeOutTime: 0.5 }]
      }
      // 重建 idle 组：汇总所有 motion 文件
      const idleFiles = new Set<string>()
      for (const defs of Object.values(motionDefs)) {
        for (const d of (defs as any[])) idleFiles.add(d.File)
      }
      motionDefs.idle = [...idleFiles].map((f: string) => ({ File: f, FadeInTime: 0.5, FadeOutTime: 0.5 }))
      ;(s as any).motions = motionDefs
    }

    // 合并松散 expressions
    if (looseExpressions.length) {
      const merged = [...(s.expressions ?? [])]
      const mergedNames = new Set(merged.map((e: any) => e.Name ?? e.File))
      for (const e of looseExpressions) {
        if (!mergedNames.has(e)) {
          merged.push({ File: e, Name: e.replace('.exp3.json', '') })
        }
      }
      ;(s as any).expressions = merged
    }

    return s
  }

  ZipLoader.readText = (zip: JSZip, path: string) => {
    const file = zip.file(path)
    if (!file) throw new Error(`Cannot find file: ${path}`)
    return file.async('text')
  }

  ZipLoader.getFilePaths = (zip: JSZip) => {
    const paths: string[] = []
    zip.forEach(p => paths.push(p))
    return Promise.resolve(paths)
  }

  ZipLoader.getFiles = (zip: JSZip, paths: string[]) =>
    Promise.all(paths.map(async (p) => {
      const blob = await zip.file(p)!.async('blob')
      const fileName = p.slice(p.lastIndexOf('/') + 1)
      return new File([blob], fileName)
    }))

  // ---- URI 编码 middleware ----
  if (!Live2DFactory.live2DModelMiddlewares.some(m => m.name === 'live2dEncodeFilenamesMiddleware')) {
    const encodeMiddleware: any = (context: any, next: any) => {
      if (typeof context.source !== 'object' || !context.source) return next()
      const s = context.source.settings as any
      if (!s) return next()
      if (typeof s.moc === 'string') s.moc = encodeURI(s.moc)
      if (Array.isArray(s.textures)) {
        for (let i = 0; i < s.textures.length; i++)
          if (typeof s.textures[i] === 'string') s.textures[i] = encodeURI(s.textures[i])
      }
      if (typeof s.url === 'string') s.url = encodeURI(s.url)
      return next()
    }
    const idx = Live2DFactory.live2DModelMiddlewares.findIndex(
      m => m.name === 'Live2DModelFileLoader' || m.toString().includes('FileLoader'),
    )
    if (idx >= 0) Live2DFactory.live2DModelMiddlewares.splice(idx, 0, encodeMiddleware)
  }
}

// ---- 加载默认模型 ----
const DEFAULT_MODEL_PATH = import.meta.env.BASE_URL + 'src/models/waifu-flat.zip'

export async function loadDefaultModel(app: Application): Promise<Live2DModel> {
  const resp = await fetch(DEFAULT_MODEL_PATH)
  const blob = await resp.blob()
  const zipFile = new File([blob], 'waifu-flat.zip')
  return loadModelFromFile(app, zipFile)
}

// ---- 加载 / 替换模型 ----
export async function loadModelFromFile(app: Application, zipFile: File): Promise<Live2DModel> {
  const model = new Live2DModel()
  await Live2DFactory.setupLive2DModel(model, [zipFile], { autoInteract: false })

  app.stage.addChild(model)
  model.anchor.set(0.5, 0.5)

  const s = fitToScreen(app, model)
  console.log('[live2d] loaded:', model.internalModel.settings.name, 'scale:', s.toFixed(2))

  // 自定义指针处理（drag/tap/focus）
  setupPointerHandling(app, model)

  // 点击动作：随机播放 motion
  model.on('hit', (hitAreas: string[]) => {
    if (!hitAreas.includes('body')) return
    try {
      const mgr = (model as any).internalModel.motionManager
      const groups = Object.keys(mgr.definitions).filter((g: string) => mgr.definitions[g]?.length > 0)
      if (groups.length) {
        const g = groups[Math.floor(Math.random() * groups.length)]
        model.motion(g)
      }
    } catch {
      model.motion('tap_body')
    }
  })

  return model
}

// ---- 替换模型（销毁旧模型） ----
export async function replaceModel(app: Application, zipFile: File): Promise<Live2DModel> {
  // 找到并移除旧模型
  for (let i = app.stage.children.length - 1; i >= 0; i--) {
    const child = app.stage.children[i]
    if (child instanceof Live2DModel) {
      child.destroy()
      app.stage.removeChild(child)
    }
  }

  return loadModelFromFile(app, zipFile)
}

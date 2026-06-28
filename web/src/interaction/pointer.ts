import type { Application } from '@pixi/app'
import type { Live2DModel } from 'pixi-live2d-display/cubism4'

const DRAG_THRESHOLD = 5

export function setupPointerHandling(app: Application, model: Live2DModel) {
  let isDragging = false
  let dragStartX = 0
  let dragStartY = 0
  let modelStartX = 0
  let modelStartY = 0
  let pointerDown = false

  const stage = app.stage
  stage.interactive = true
  stage.hitArea = app.renderer.screen

  function onPointerDown(e: any) {
    // 检查点击目标是模型或其子元素
    if (e.target && (e.target === model || isDescendantOf(e.target, model))) {
      pointerDown = true
      isDragging = false
      dragStartX = e.data.global.x
      dragStartY = e.data.global.y
      modelStartX = model.x
      modelStartY = model.y
    }
  }

  function onPointerMove(e: any) {
    // 始终更新视线追踪
    model.focus(e.data.global.x, e.data.global.y, true)

    if (!pointerDown) return

    const dx = e.data.global.x - dragStartX
    const dy = e.data.global.y - dragStartY

    if (!isDragging && (Math.abs(dx) + Math.abs(dy)) > DRAG_THRESHOLD) {
      isDragging = true
    }
    if (isDragging) {
      model.x = modelStartX + dx
      model.y = modelStartY + dy
    }
  }

  function onPointerUp(e: any) {
    if (!pointerDown) return
    pointerDown = false

    if (!isDragging) {
      // 短点击 → 触发 tap
      model.tap(e.data.global.x, e.data.global.y)
    }
    // isDragging 的 case：拖拽结束，不再移动
    isDragging = false
  }

  function onPointerUpOutside() {
    pointerDown = false
    isDragging = false
  }

  stage.on('pointerdown', onPointerDown)
  stage.on('pointermove', onPointerMove)
  stage.on('pointerup', onPointerUp)
  stage.on('pointerupoutside', onPointerUpOutside)
}

function isDescendantOf(child: any, ancestor: any): boolean {
  let cur = child.parent
  while (cur) {
    if (cur === ancestor) return true
    cur = cur.parent
  }
  return false
}

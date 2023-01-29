import Brush from "./Brush";

export default class Eraser extends Brush{
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.ctx.globalCompositeOperation = 'destination-out'
    }

    mouseMoveHandler(e) {
        if (this.mousedown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    stroke: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    static draw(ctx, x, y, lineWidth) {
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = lineWidth
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}
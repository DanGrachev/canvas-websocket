import Tool from "./Tool";

export default class Circle extends Tool{
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mousedown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'circle',
                x: this.startX,
                y: this.startY,
                radius: this.radius,
                color: this.ctx.fillStyle,
                stroke: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }
    mouseDownHandler(e) {
        this.mousedown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft
        this.startY = e.pageY - e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }
    mouseMoveHandler(e) {
        if (this.mousedown) {
            let currentX = e.pageX - e.target.offsetLeft
            let currentY = e.pageY - e.target.offsetTop
            let width = currentX - this.startX
            let height = currentY - this.startY
            this.radius = Math.sqrt(width**2 + height**2)
            this.draw(this.startX, this.startY, this.radius)
        }
    }

    draw(x, y, r) {
        const img = new Image()
        img.src = this.saved
        img.onload = async () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)

            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static drawOnline(ctx, x, y, r, color, stroke, lineWidth) {
        ctx.fillStyle = color
        ctx.strokeStyle = stroke
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}
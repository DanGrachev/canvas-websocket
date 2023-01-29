import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Button, Input, Modal} from "antd";
import axios from "axios";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Eraser from "../tools/Eraser";
import Circle from "../tools/Circle";
import "../styles/canvas.scss";
import Line from "../tools/Line";

const Canvas = observer(() => {
    const canvasRef = useRef()
    const params = useParams()
    const [isModalOpen, setIsModalOpen] = useState(true);
    const inputRef = useRef(null)


    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        const ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = async () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            })
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`ws://localhost:5000/`)
            canvasState.setSocket(socket)
            canvasState.setSessionID(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))

            socket.onopen = () => {
                console.log("Подключение установлено")
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                switch (msg.method) {
                    case "connection":
                        console.log(`Пользователь ${msg.username} подключился`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [canvasState.username])

    const mouseUpHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data))
    }

    function connectionHandler() {
        canvasState.setUsername(inputRef.current.input.value)
        setIsModalOpen(false)
    }

    function drawHandler(msg) {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.color, figure.stroke, figure.lineWidth)
                break
            case "eraser":
                Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
                break
            case "rect":
                Rect.drawOnline(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.stroke, figure.lineWidth)
                break
            case "circle":
                Circle.drawOnline(ctx, figure.x, figure.y, figure.radius ,figure.color, figure.stroke, figure.lineWidth)
                break
            case "line":
                Line.drawOnline(ctx, figure.x, figure.y, figure.currentX, figure.currentY ,figure.stroke, figure.lineWidth)
                break
            case "finish":
                ctx.beginPath()
                break
        }
    }

    return (
        <div className="canvas">
            <Modal title="Enter your username" open={isModalOpen}
                   onOk={() => setIsModalOpen(false)} footer={false}>
                <Input ref={inputRef} style={{marginBottom: '15px'}}/>
                <Button type="primary" size="large" onClick={connectionHandler}>Confirm</Button>
            </Modal>

            <canvas ref={canvasRef} width={800} height={500}
                    onMouseUp={() => mouseUpHandler()}
            />
        </div>
    );
});

export default Canvas;
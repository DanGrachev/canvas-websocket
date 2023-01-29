import React from 'react';
import "../styles/toolbar.scss";
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";

const Toolbar = () => {

    const changeColor = (e) => {
        toolState.setFillColor(e.target.value)
        toolState.setStrokeColor(e.target.value)
    }

    const downloadImg = () => {
        const dataURL = canvasState.canvas.toDataURL()
        const a = document.createElement("a")
        a.href = dataURL
        a.download = canvasState.sessionID + ".jpg"
        document.body.append(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className="toolbar">
            <button className={"toolbar__btn brush"} title="Brush"
                    onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionID))}
            />
            <button className="toolbar__btn rect" title="Rect"
                    onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionID))}
            />
            <button className="toolbar__btn circle" title="Circle"
                    onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionID))}
            />
            <button className="toolbar__btn line" title="Line"
                    onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionID))}
            />
            <button className="toolbar__btn eraser" title="Eraser"
                    onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionID))}
            />
            <input type="color" className="rgb-palette" title="RGB Palette"
                   onChange={e => changeColor(e)}
            />

            <button className="toolbar__btn undo" title="Undo"
                    onClick={() => canvasState.undo()}
            />
            <button className="toolbar__btn redo" title="Redo"
                    onClick={() => canvasState.redo()}
            />
            <button className="toolbar__btn save" title="Save image"
                    onClick={downloadImg}
            />
        </div>
    );
};

export default Toolbar;
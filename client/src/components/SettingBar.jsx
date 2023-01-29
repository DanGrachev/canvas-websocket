import React from "react";
import toolState from "../store/toolState";
import "../styles/toolbar.scss";

const SettingBar = () => {


    return (
        <div className="setting-bar">
            <div className="setting-bar__item setting-bar__line-width">
                <label htmlFor="line-width">Line width:</label>
                <input id="line-width" type="number" defaultValue={1} min={1} max={100}
                       onChange={e => toolState.setLineWidth(e.target.value)}/>
            </div>

            <div className="setting-bar__item setting-bar__stroke-color">
                <label htmlFor="stroke-color">Stroke color:</label>
                <input id="stroke-color" type="color"
                       onChange={e => toolState.setStrokeColor(e.target.value)}/>
            </div>

        </div>
    );
};

export default SettingBar;
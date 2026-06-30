import React, { useState, useRef, useEffect } from 'react';
import {
    changeWindowSize,
} from "@services/CoupleService";
import { useDispatch } from 'react-redux';
import { toggleLoading } from "@store/AppSlice";

function SCWindow(props) {
    const initialHeight = Number(props.selectedEvent.seatingChartWindowHeight);
    const [height, setHeight] = useState(isNaN(initialHeight) ? 600 : initialHeight);
    const ref = useRef(null);
    const dispatch = useDispatch();

    const handleMouseDown = (e) => {
        setIsResizing(true);
        setStartY(e.clientY);
        setStartHeight(height);
    };

    const [isResizing, setIsResizing] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startHeight, setStartHeight] = useState(0);

    useEffect(() => {
        setHeight(Number(props.selectedEvent.seatingChartWindowHeight));
    }, [props.selectedEvent]);

    useEffect(() => {
        const handleResize = (e) => {
            if (isResizing) {
                const dy = e.clientY - startY;
                setHeight(startHeight + dy);
                props.onWindowResized(startHeight + dy);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            if (Number(props.selectedEvent.seatingChartWindowHeight) !== height) {
                tryChangeWindowSize(height);
            }
        };

        window.addEventListener('mousemove', handleResize);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleResize);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, startY, startHeight, height]);

    const tryChangeWindowSize = async (height) => {
        try {
            dispatch(toggleLoading(true));
            await changeWindowSize({ height: height, eventId: props.selectedEvent.id });
            dispatch(toggleLoading(false));
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="sc-window" style={{ height: `${props.generatingPdf ? height + 300 : height}px` }} ref={ref}>
            {props.children}
            <div className="resize-handle" onMouseDown={handleMouseDown}>
                <span className="bi bi-three-dots"></span>
            </div>
        </div>
    );
}

export default SCWindow;

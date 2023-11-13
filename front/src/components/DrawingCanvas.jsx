import { useState, useRef, useEffect } from "react";
import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    canvas: {
        border: "1px solid black",
        borderRadius: "5px",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
        cursor: "crosshair",
        backgroundColor: "white",
    },
    button: {
        margin: "0 10px 10px 10px",
    },
});

function DrawingCanvas() {
    const classes = useStyles();
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [coordinates, setCoordinates] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = 300;
        canvas.height = 300;

        context.lineWidth = 10;
        context.lineCap = "round";
        context.strokeStyle = "black";
    }, []);

    const startDrawing = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        setIsDrawing(true);
        setCoordinates((prevCoordinates) => [
            ...prevCoordinates,
            { x: offsetX, y: offsetY },
        ]);
    };

    const draw = (event) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = event.nativeEvent;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        setCoordinates((prevCoordinates) => [
            ...prevCoordinates,
            { x: offsetX, y: offsetY },
        ]);

        context.beginPath();
        if (coordinates.length > 0) {
            const lastCoordinate = coordinates[coordinates.length - 1];
            context.moveTo(lastCoordinate.x, lastCoordinate.y);
        }
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        setCoordinates([]);
    };

    const saveDrawing = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = "drawing.png";
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
                <canvas
                    className={classes.canvas}
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                />
            </Grid>
            <Grid item>
                <Grid container justify="center" spacing={2}>
                    <Grid item>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                            onClick={clearCanvas}
                        >
                            Clear
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={saveDrawing}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default DrawingCanvas;

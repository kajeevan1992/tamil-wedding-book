import Countdown from 'react-countdown';

export default function CountdownTimer(props) {
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        // if (completed) {
        //     // Render a completed state
        //     return <Completionist />;
        // } else {
        //     // Render a countdown
        //     return <span>{days}:{hours}:{minutes}:{seconds}</span>;
        // }
        return (
            <>
                <div className="countdown-custom-render">
                    <span className="count-num-wrapper">
                        <span className="count-num">{days}</span>
                        <br />
                        <small className="count-num-label">Days</small>
                    </span>
                    <span className="count-num-wrapper">
                        <span className="count-num">{hours}</span>
                        <br />
                        <small className="count-num-label">Hours</small>
                    </span>
                    <span className="count-num-wrapper">
                        <span className="count-num">{minutes}</span>
                        <br />
                        <small className="count-num-label">Min</small>
                    </span>
                    <span className="count-num-wrapper">
                        <span className="count-num">{seconds}</span>
                        <br />
                        <small className="count-num-label">S</small>
                    </span>
                </div>
            </>
        );
    };

    return (<Countdown date={props.date} renderer={renderer} />);
}
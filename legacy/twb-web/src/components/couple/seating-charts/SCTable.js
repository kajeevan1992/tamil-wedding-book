export default function SCTable(props) {
    const whichTable = (props) => {
        if (props.table.type === 'sc-one-sided-table') {
            return <div className="sc-one-sided-table-top-side">
                {props.table.coupleWeddingEventTableChairs.map((chair, chairIndex) => {
                    return (
                        <div
                            className="sc-table-chair"
                            onDrop={(event) => props.onGuestSeated(event, chair)}
                            onDragOver={(event) => props.onAllowGuestDrop(event)}
                            onDragLeave={(event) => props.onDropChoiceChanged(event)}
                            key={`chair-${props.table.id}-${chair.id}-${chairIndex}`}
                        >
                            {chair.coupleWeddingGuest && <div
                                id={`guest-${chair.coupleWeddingGuest.id}`}
                                className="sc-guest"
                                draggable={true}
                                onDragStart={(event) => props.onGuestDragging(event, chair)}
                                onMouseEnter={() => props.onSetIsMoveable(true)}
                                onMouseLeave={() => props.onSetIsMoveable(false)}
                                onDragEnd={(event) => props.onGuestDraggingEnd(event)}
                            >
                                <span className="bi bi-person-circle"></span>
                                <small>
                                    {chair.coupleWeddingGuest.fullName}
                                </small>
                            </div>}
                        </div>
                    );
                })}
            </div>
        } else if (props.table.type === 'sc-two-sided-table') {
            return <>
                <div className="sc-two-sided-table-top-side">
                    {props.table.coupleWeddingEventTableChairs.slice(0, props.table.coupleWeddingEventTableChairs.length / 2).map((chair, chairIndex) => {
                        return (
                            <div
                                className="sc-table-chair"
                                onDrop={(event) => props.onGuestSeated(event, chair)}
                                onDragOver={(event) => props.onAllowGuestDrop(event)}
                                key={`chair-${props.table.id}-${chair.id}-${chairIndex}`}
                                onDragLeave={(event) => props.onDropChoiceChanged(event)}
                            >
                                {chair.coupleWeddingGuest && <div
                                    id={`guest-${chair.coupleWeddingGuest.id}`}
                                    className="sc-guest"
                                    draggable={true}
                                    onDragStart={(event) => props.onGuestDragging(event, chair)}
                                    onMouseEnter={() => props.onSetIsMoveable(true)}
                                    onMouseLeave={() => props.onSetIsMoveable(false)}
                                    onDragEnd={(event) => props.onGuestDraggingEnd(event)}
                                >
                                    <span className="bi bi-person-circle"></span>
                                    <small>
                                        {chair.coupleWeddingGuest.fullName}
                                    </small>
                                </div>}
                            </div>
                        );
                    })}
                </div>
                <div className="sc-two-sided-table-bottom-side">
                    {props.table.coupleWeddingEventTableChairs.slice(props.table.coupleWeddingEventTableChairs.length / 2).map((chair, chairIndex) => {
                        return (
                            <div
                                className="sc-table-chair"
                                onDrop={(event) => props.onGuestSeated(event, chair)}
                                onDragOver={(event) => props.onAllowGuestDrop(event)}
                                onDragLeave={(event) => props.onDropChoiceChanged(event)}
                                key={`chair-${props.table.id}-${chair.id}-${chairIndex}`}
                            >
                                {chair.coupleWeddingGuest && <div
                                    id={`guest-${chair.coupleWeddingGuest.id}`}
                                    className="sc-guest"
                                    draggable={true}
                                    onDragStart={(event) => props.onGuestDragging(event, chair)}
                                    onMouseEnter={() => props.onSetIsMoveable(true)}
                                    onMouseLeave={() => props.onSetIsMoveable(false)}
                                    onDragEnd={(event) => props.onGuestDraggingEnd(event)}
                                >
                                    <span className="bi bi-person-circle"></span>
                                    <small>
                                        {chair.coupleWeddingGuest.fullName}
                                    </small>
                                </div>}
                            </div>
                        );
                    })}
                </div>
            </>
        } else if (props.table.type === 'sc-four-sided-table') {
            let chairs = props.table.coupleWeddingEventTableChairs;
            let firstChair = chairs[0];
            let lastChair = chairs[chairs.length - 1];
            let remainingChairs = chairs.slice(1, chairs.length - 1);

            return <>
                <div className="sc-four-sided-table-left-side">
                    <div
                        className="sc-table-chair"
                        onDrop={(event) => props.onGuestSeated(event, firstChair)}
                        onDragOver={(event) => props.onAllowGuestDrop(event)}
                        onDragLeave={(event) => props.onDropChoiceChanged(event)}
                        key={`chair-${props.table.id}-first-${firstChair.id}`}
                    >
                        {firstChair.coupleWeddingGuest && <div
                            id={`guest-${firstChair.coupleWeddingGuest.id}`}
                            className="sc-guest"
                            draggable={true}
                            onDragStart={(event) => props.onGuestDragging(event, firstChair)}
                            onMouseEnter={() => props.onSetIsMoveable(true)}
                            onMouseLeave={() => props.onSetIsMoveable(false)}
                            onDragEnd={(event) => props.onGuestDraggingEnd(event)}
                        >
                            <span className="bi bi-person-circle"></span>
                            <small>
                                {firstChair.coupleWeddingGuest.fullName}
                            </small>
                        </div>}
                    </div>
                </div>
                <div className="sc-four-sided-table-top-side">
                    {remainingChairs.slice(0, remainingChairs.length / 2).map((chair, chairIndex) => {
                        return (
                            <div
                                className="sc-table-chair"
                                onDrop={(event) => props.onGuestSeated(event, chair)}
                                onDragOver={(event) => props.onAllowGuestDrop(event)}
                                onDragLeave={(event) => props.onDropChoiceChanged(event)}
                                key={`chair-${props.table.id}-${chair.id}-${chairIndex}`}
                            >
                                {chair.coupleWeddingGuest && <div
                                    id={`guest-${chair.coupleWeddingGuest.id}`}
                                    className="sc-guest"
                                    draggable={true}
                                    onDragStart={(event) => props.onGuestDragging(event, chair)}
                                    onMouseEnter={() => props.onSetIsMoveable(true)}
                                    onMouseLeave={() => props.onSetIsMoveable(false)}
                                    onDragEnd={(event) => props.onGuestDraggingEnd(event)}
                                >
                                    <span className="bi bi-person-circle"></span>
                                    <small>
                                        {chair.coupleWeddingGuest.fullName}
                                    </small>
                                </div>}
                            </div>
                        );
                    })}
                </div>
                <div className="sc-four-sided-table-bottom-side">
                    {remainingChairs.slice(remainingChairs.length / 2).map((chair, chairIndex) => {
                        return (
                            <div
                                className="sc-table-chair"
                                onDrop={(event) => props.onGuestSeated(event, chair)}
                                onDragOver={(event) => props.onAllowGuestDrop(event)}
                                onDragLeave={(event) => props.onDropChoiceChanged(event)}
                                key={`chair-${props.table.id}-${chair.id}-${chairIndex}`}
                            >
                                {chair.coupleWeddingGuest && <div
                                    id={`guest-${chair.coupleWeddingGuest.id}`}
                                    className="sc-guest"
                                    draggable={true}
                                    onDragStart={(event) => props.onGuestDragging(event, chair)}
                                    onMouseEnter={() => props.onSetIsMoveable(true)}
                                    onMouseLeave={() => props.onSetIsMoveable(false)}
                                    onDragEnd={(event) => props.onGuestDraggingEnd(event)}
                                >
                                    <span className="bi bi-person-circle"></span>
                                    <small>
                                        {chair.coupleWeddingGuest.fullName}
                                    </small>
                                </div>}
                            </div>
                        );
                    })}
                </div>
                <div className="sc-four-sided-table-right-side">
                    <div
                        className="sc-table-chair"
                        onDrop={(event) => props.onGuestSeated(event, lastChair)}
                        onDragOver={(event) => props.onAllowGuestDrop(event)}
                        onDragLeave={(event) => props.onDropChoiceChanged(event)}
                        key={`chair-${props.table.id}-last-${lastChair.id}`}
                    >
                        {lastChair.coupleWeddingGuest && <div
                            id={`guest-${lastChair.coupleWeddingGuest.id}`}
                            className="sc-guest"
                            draggable={true}
                            onDragStart={(event) => props.onGuestDragging(event, lastChair)}
                            onMouseEnter={() => props.onSetIsMoveable(true)}
                            onMouseLeave={() => props.onSetIsMoveable(false)}
                            onDragEnd={(event) => props.onGuestDraggingEnd(event)}
                        >
                            <span className="bi bi-person-circle"></span>
                            <small>
                                {lastChair.coupleWeddingGuest.fullName}
                            </small>
                        </div>}
                    </div>
                </div>
            </>
        } else if (props.table.type === 'sc-rounded-table') {
            return <>
                {props.table.coupleWeddingEventTableChairs.map((chair, chairIndex) => {
                    return (
                        <div
                            className="sc-table-chair"
                            onDrop={(event) => props.onGuestSeated(event, chair)}
                            onDragOver={(event) => props.onAllowGuestDrop(event)}
                            onDragLeave={(event) => props.onDropChoiceChanged(event)}
                            key={`chair-${props.table.id}-${chair.id}-${chairIndex}`}
                        >
                            {chair.coupleWeddingGuest && <div
                                id={`guest-${chair.coupleWeddingGuest.id}`}
                                className="sc-guest"
                                draggable={true}
                                onDragStart={(event) => props.onGuestDragging(event, chair)}
                                onMouseEnter={() => props.onSetIsMoveable(true)}
                                onMouseLeave={() => props.onSetIsMoveable(false)}
                                onDragEnd={(event) => props.onGuestDraggingEnd(event)}
                            >
                                <span className="bi bi-person-circle"></span>
                                <small>
                                    {chair.coupleWeddingGuest.fullName}
                                </small>
                            </div>}
                        </div>
                    );
                })}
            </>
        }
    }

    return (
        whichTable(props)
    );
}
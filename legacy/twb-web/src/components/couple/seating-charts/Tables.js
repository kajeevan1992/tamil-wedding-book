import { useRef } from "react";
import WeddingEventItemModal from "@components/couple/guest-list/WeddingEventItemModal";
import { tables } from "@utilities/CommonUtil";

export default function Tables(props) {
    const weddingEventItemModal = useRef(null);
    const showWeddingItemModal = (action, item = {}, table) => {
        weddingEventItemModal.current.showModal(
            props.selectedEvent.id,
            action,
            item,
            'table',
            table.type,
            1,
        );
    }
    const hideWeddingItemModal = () => {
        weddingEventItemModal.current.hideModal();
    }

    return (
        <div>
            <strong>Tables</strong>
            <div className="d-flex justify-content-between">
                {tables.map((table, tIndex) => <label
                    key={`table-${tIndex}`}
                    draggable={true}
                    onDragEnd={(event) => showWeddingItemModal('add', {}, table)}
                >
                    <img src={`/assets/images/seating-charts/${table.icon}`} className="c-p" />
                </label>)}
            </div>

            <WeddingEventItemModal
                app={props.app}
                ref={weddingEventItemModal}
                selectedFilter={{
                    label: 'Seating Chart',
                    id: 'coupleWeddingEventTableId',
                    model: 'CoupleWeddingEventTable',
                    name: 'coupleWeddingEventTables',
                    actionType: 'table',
                }}
                onHideModal={hideWeddingItemModal}
                onItemCreated={(item) => props.onTableCreated(item)}
                onItemUpdated={(item) => props.onTableUpdated(item)}
            />
        </div>
    );
}
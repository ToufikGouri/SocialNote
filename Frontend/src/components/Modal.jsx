import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (e.target.classList.contains('modal-overlay')) onClose();
        };

        if (isOpen) document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed text-black top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50 modal-overlay">
            <div className="bg-white flex flex-col text-start rounded-lg shadow-md overflow-hidden mx-4 w-full max-w-md">
                <div className="p-6">{children}</div> {/* Props text content */}
                <button className="bg-myBlue border-2 mb-3 mx-3 self-end text-white px-4 py-2 rounded-lg hover:bg-white hover:text-hoverBlue hover:border-hoverBlue" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;

{/* <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
<h2 className="text-xl mb-2">Thank you for your request</h2>
<p>This feature is coming soon till then please explore the page.</p>
</Modal> */}

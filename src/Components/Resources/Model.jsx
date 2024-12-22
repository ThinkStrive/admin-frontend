// Modal.js
import React from 'react';
import '../../Styles/Model.css'
// import { format } from 'path';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" 
    // onClick={onClose}
    >
      <div className="modal-container" 
      // onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className='font-semibold text-lg' >{title}</h2>
          <button className="modal-close-button" onClick={onClose} >
            <i className='fa-solid fa-x font-bold text-lg' ></i>
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
        {/* <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>Close</button>
        </div> */}
      </div>
    </div>
  );
};

export default Modal;






// Model format

// const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalContent, setModalContent] = useState("");



//   setModalContent("You have logged in successfully.");
//   setIsModalOpen(true);



//   <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title="Login Status"
//       >
//         <p>{modalContent}</p>
//       </Modal>

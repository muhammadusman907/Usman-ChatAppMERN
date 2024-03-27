import Swal from "sweetalert2"
const successModal = (message) =>{
     Swal.fire({
       icon: "success",
       text:message,
       showConfirmButton: false,
       timer: 1500,
     });
}
const errorModal = (message) => {
     Swal.fire({
       icon: "error",
       text: message,
     });
}
export {successModal , errorModal}
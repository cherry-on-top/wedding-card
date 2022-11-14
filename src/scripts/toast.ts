import Swal from "sweetalert2";

export const toast = Swal.mixin({
  toast: true,
  showConfirmButton: false,
  timerProgressBar: false,
  timer: 3000,
  position: "bottom",
  showClass: {
    popup: "animated animate-fade-in",
  },
  hideClass: {
    popup: "animated animate-fade-out",
  },
});

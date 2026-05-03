import Swal from "sweetalert2";

const herbal = Swal.mixin({
  customClass: {
    popup: "herbal-sw-popup",
    confirmButton: "herbal-sw-confirm",
    cancelButton: "herbal-sw-cancel",
    toast: "herbal-sw-toast",
  },
  confirmButtonColor: "#388e3c",
  cancelButtonColor: "#b45309",
  color: "#14532d",
});

export const showSuccessToast = (message = "Success") => {
  herbal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1800,
  });
};

export const showErrorToast = (message = "Something went wrong") => {
  herbal.fire({
    toast: true,
    position: "top-end",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 2800,
  });
};

export const showLoader = (message = "Please wait…") => {
  herbal.fire({
    title: message,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoader = () => {
  Swal.close();
};

export const confirmAction = async (message = "Are you sure?") => {
  const result = await herbal.fire({
    title: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });

  return result.isConfirmed;
};

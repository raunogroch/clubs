import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { clearMessage } from "../store/messageSlice";

export const PopUpMessage = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state: RootState) => state.message);
  const showMessage = message;
  const showType = type || "danger";

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showMessage, dispatch]);

  const handleClose = () => dispatch(clearMessage());

  if (!showMessage) return null;

  return (
    <div className={`alert alert-${showType} alert-dismissible mb-0`}>
      <button
        aria-hidden="true"
        data-dismiss="alert"
        className="close"
        type="button"
        onClick={handleClose}
      >
        ×
      </button>
      {showMessage}
    </div>
  );
};

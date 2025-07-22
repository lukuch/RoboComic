import Tooltip from "../shared/Tooltip";
import { FaRegQuestionCircle } from "react-icons/fa";

interface FormLabelProps {
  children: React.ReactNode;
  tooltip?: string;
}

export function FormLabel({ children, tooltip }: FormLabelProps) {
  return (
    <label
      className={`flex items-center mb-2 font-semibold text-gray-700 dark:text-gray-200 ${tooltip ? "relative" : ""}`}
    >
      {children}
      {tooltip && (
        <Tooltip content={tooltip}>
          <FaRegQuestionCircle
            className="ml-2 text-blue-500 hover:text-blue-600 transition cursor-pointer align-middle"
            size={16}
          />
        </Tooltip>
      )}
    </label>
  );
}

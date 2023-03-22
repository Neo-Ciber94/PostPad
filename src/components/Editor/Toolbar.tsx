import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";
import ReactQuill from "react-quill";
import { DarkModeToggle } from "../DarkModeToggle";

const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
  "roboto",
  "quicksand",
];
ReactQuill.Quill.register(Font, true);

export interface ToolbarProps {
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
}

/*
 * Custom toolbar component including the custom heart button and dropdowns
 */
const Toolbar = ({ isFullScreen, onToggleFullScreen }: ToolbarProps) => (
  <div id="toolbar" className="flex flex-col">
    <span className="flex flex-row items-center justify-between">
      <div>
        <span className="ql-formats">
          <select className="ql-font" defaultValue="quicksand">
            <option value="arial">Arial</option>
            <option value="courier-new">Courier New</option>
            <option value="georgia">Georgia</option>
            <option value="helvetica">Helvetica</option>
            <option value="lucida">Lucida</option>
            <option value="roboto">Roboto</option>
            <option value="quicksand">Quicksand</option>
          </select>

          <select className="ql-size" defaultValue="medium" />

          <select className="ql-header" defaultValue="1" />

          <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
          </span>

          <span className="ql-formats">
            <select className="ql-align" />
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
          </span>
        </span>
      </div>
      <div>
        <DarkModeToggle />
        <button
          type="button"
          className="!h-8 !w-8"
          onClick={onToggleFullScreen}
        >
          {isFullScreen ? <ArrowsPointingInIcon /> : <ArrowsPointingOutIcon />}
        </button>
      </div>
    </span>

    <hr className="my-2 opacity-10" />
    <div className="ql-formats">
      <span className="ql-formats">
        <button className="ql-script" value="super" />
        <button className="ql-script" value="sub" />
        <button className="ql-blockquote" />
        <button className="ql-direction" />
      </span>

      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>

      <span className="ql-formats">
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
      </span>

      <span className="ql-formats">
        <button className="ql-formula" />
        <button className="ql-code-block" />
        <button className="ql-clean" />
      </span>
    </div>
  </div>
);

export default Toolbar;

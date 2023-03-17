import {
  SunIcon,
  MoonIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";

export interface ToolbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
}

/*
 * Custom toolbar component including the custom heart button and dropdowns
 */
const Toolbar = ({
  isDarkMode,
  onToggleDarkMode,
  isFullScreen,
  onToggleFullScreen,
}: ToolbarProps) => (
  <div id="toolbar" className="flex flex-col">
    <span className="flex flex-row items-center justify-between">
      <div>
        <span className="ql-formats">
          <select className="ql-font" defaultValue="arial">
            <option value="arial">Arial</option>
            <option value="comic-sans">Comic Sans</option>
            <option value="courier-new">Courier New</option>
            <option value="georgia">Georgia</option>
            <option value="helvetica">Helvetica</option>
            <option value="lucida">Lucida</option>
          </select>

          <select className="ql-size" defaultValue="medium">
            <option value="extra-small">Size 1</option>
            <option value="small">Size 2</option>
            <option value="medium">Size 3</option>
            <option value="large">Size 4</option>
          </select>

          <select className="ql-header" defaultValue="3">
            <option value="1">Heading</option>
            <option value="2">Subheading</option>
            <option value="3">Normal</option>
          </select>

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
        <button type="button" className="!h-8 !w-8" onClick={onToggleDarkMode}>
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>

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
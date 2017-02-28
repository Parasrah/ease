
export interface IMdlUpgrade {
    upgradeDom: () => void;
    upgradeElement: (element: HTMLElement, type: string) => void;
}

export const MATERIAL_BUTTON_TYPE = "MaterialButton";
export const MATERIAL_CHECKBOX_TYPE = "MaterialCheckbox";
export const MATERIAL_ICON_TOGGLE_TYPE = "MaterialIconToggle";
export const MATERIAL_MENU_TYPE = "MaterialMenu";
export const MATERIAL_PROGRESS_TYPE = "MaterialProgress";
export const MATERIAL_RADIO_TYPE = "MaterialRadio";
export const MATERIAL_SLIDER_TYPE = "MaterialSlider";
export const MATERIAL_SPINNER_TYPE = "MaterialSpinner";
export const MATERIAL_SWITCH_TYPE = "MaterialSwitch";
export const MATERIAL_TABS_TYPE = "MaterialTabs";
export const MATERIAL_TEXTFIELD_TYPE = "MaterialTextfield";
export const MATERIAL_TOOLTIP_TYPE = "MaterialTooltip";
export const MATERIAL_LAYOUT_TYPE = "MaterialLayout";
export const MATERIAL_DATA_TABLE_TYPE = "MaterialDataTable";
export const MATERIAL_RIPPLE_TYPE = "MaterialRipple";

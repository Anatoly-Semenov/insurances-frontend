export namespace UiTooltip {
	export type Placement =
		| "top"
		| "left"
		| "right"
		| "bottom"
		| "topLeft"
		| "topRight"
		| "bottomLeft"
		| "bottomRight"
		| "leftTop"
		| "leftBottom"
		| "rightTop"
		| "rightBottom"

	export enum PlacementEnum {
		TOP = "top",
		LEFT = "left",
		RIGHT = "right",
		BOTTOM = "bottom",
		TOPLEFT = "topLeft",
		TOPRIGHT = "topRight",
		BOTTOMLEFT = "bottomLeft",
		BOTTOMRIGHT = "bottomRight",
		LEFTTOP = "leftTop",
		LEFTBOTTOM = "leftBottom",
		RIGHTTOP = "rightTop",
		RIGHTBOTTOM = "rightBottom"
	}

	export type Trigger = "hover" | "focus" | "click" | "contextmenu"

	export enum TriggerEnum {
		HOVER = "hover",
		FOCUS = "focus",
		CLICK = "click",
		CONTEXTMENU = "contextmenu"
	}
}

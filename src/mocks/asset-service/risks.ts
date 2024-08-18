// Types
import { AssetService } from "~/types"

const risks: AssetService.Risk[] = [
	{
		id: 1,
		name: "базовый пакет рисков (все риски)",
		orderNumber: 1,
		selected: false
	},
	{
		id: 3,
		name: "ущерб в результате проведения некапитального ремонта",
		orderNumber: 6,
		selected: false
	},
	{
		id: 4,
		name: "ущерб в результате террористических актов и диверсий",
		orderNumber: 3,
		selected: false
	},
	{
		id: 5,
		name: "народные волнения (SRCC)",
		orderNumber: 4,
		selected: false
	},
	{
		id: 6,
		name: "поименованные риски (Согаз)",
		orderNumber: 2,
		selected: false
	},
	{
		id: 7,
		name: "бой стекол",
		orderNumber: 5,
		selected: false
	}
]

export default risks

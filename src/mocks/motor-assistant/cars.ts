// Lodash
import _cloneDeep from "lodash/cloneDeep"

// Mocks
import motorCar from "./car"

// Types
import { MotorService } from "@common-repo/types/src"

const motorCars: MotorService.Vehicle[] = [1, 2, 3, 4, 5, 6, 7, 8].map((id) => {
	const car = _cloneDeep(motorCar)

	car.id = id

	return car
})

export default motorCars

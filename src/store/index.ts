import create from "zustand"
import produce from "immer"

const useStore = create((set) => ({
	showInfo: false,
	setShowInfo: (payload: any) => set(produce((state: any) => {
		state.showInfo = payload
	})),

	spriteImageArray: {} as any,
	setSpriteImageArray: (payload: any) => set(produce((state: any) => {
		state.spriteImageArray = payload
	})),

	isLoadFinished: false,
	setIsLoadFinished: (payload: any) => set(produce((state: any) => {
		state.isLoadFinished = payload
	})),

	isModalLoaded: false,
	setIsModalLoaded: (payload: any) => set(produce((state: any) => {
		state.isModalLoaded = payload
	})),

	canStartAnim: false,
	setCanStartAnim: (payload: any) => set(produce((state: any) => {
		state.canStartAnim = payload
	})),

	rotateIdle: false,
	setRotateIdle: (payload: any) => set(produce((state: any) => {
		state.rotateIdle = payload
	}))
}))

export default useStore

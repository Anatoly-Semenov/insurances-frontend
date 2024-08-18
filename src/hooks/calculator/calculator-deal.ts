export function useDeal() {
	const route = useRoute()

	const dealId = computed((): number => {
		return +route?.params?.id || 0
	})

	const isDetail = computed((): boolean => !!dealId.value)

	return { dealId, isDetail }
}

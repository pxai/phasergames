const getParameters = () => {
	const parameterList = new URLSearchParams(window.location.search)

	let map = new Map()

	parameterList.forEach((value, key) => {
		map.set(key, value)
	})

	return map
}


export default getParameters;

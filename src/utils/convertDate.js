const convertDate = (date) => {
    const year = date.slice(0, 4)
    const month = date.slice(4, 6)
    const day = date.slice(6, 8)
    const hour = date.slice(8, 10)
    const minute = date.slice(10, 12)
    return {
        year,
        month,
        day,
        hour,
        minute
    }
}

export default convertDate
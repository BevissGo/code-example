export const setHeader = async () => {
    const token = await localStorage.getItem('access-token')
    const authToken = 'Bearer ' + token
    const headerToken = {
        headers: {
            Authorization: authToken,
        },
    }
    return headerToken
}


// Logic Function to check if all task in a particuller colection has all been done or not


export const checkTaskCompletion = async (all_task_checked_Array) => {
    try {

        // console.log(allTaskCheckedArray)
        const allCompleted = all_task_checked_Array.every(a => a.checked === true)

        console.log(`completed ${allCompleted}`)

        return allCompleted
    } catch (err) {
        return console.error("error running 'checkTaskCompletion' function", err)
    }
}
export const extractFields = result => {
    let fields = []
    if (result.right && result.right.right) {
        fields = fields.concat(extractFields(result.right))
    }
    if (result.left && result.left.field && result.left.field !== '<implicit>') {
        fields.push(result.left.field)
    }
    if (result.right && result.right.field && result.right.field !== '<implicit>') {
        fields.push(result.right.field)
    }
    if (result && result.field && result.field !== '<implicit>') {
        fields.push(result.field)
    }
    return fields
}

export default extractFields

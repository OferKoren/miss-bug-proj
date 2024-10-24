export function FilterBugs({ filterBy, onSetFilterBy }) {
    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break

            case 'checkbox':
                value = target.checked
                break
        }
        onSetFilterBy({ [field]: value })
    }
    return (
        <section className="filterBugs">
            <form action="">
                <label htmlFor="title">title</label>
                <input type="search" name="title" id="title" value={filterBy.title} onChange={handleChange} />
                <label htmlFor="severity">min severity</label>
                <input type="number" name="severity" id="severity" value={filterBy.severity} onChange={handleChange} />
            </form>
        </section>
    )
}

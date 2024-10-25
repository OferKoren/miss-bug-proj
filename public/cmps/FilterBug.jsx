export function FilterBugs({ filterBy, onSetFilterBy, onChangePage }) {
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
            <form action="" className="filter-bug-form">
                <label htmlFor="title">title</label>
                <input type="search" name="title" id="title" value={filterBy.title} onChange={handleChange} />
                <label htmlFor="severity">min severity</label>
                <input type="number" name="minSeverity" id="severity" value={filterBy.severity} onChange={handleChange} />
                <div className="pagination flex">
                    <button type="button" onClick={() => onChangePage(-1)}>
                        -
                    </button>
                    <span>{filterBy.pageIdx + 1}</span>
                    <button type="button" onClick={() => onChangePage(+1)}>
                        +
                    </button>
                </div>
            </form>
        </section>
    )
}

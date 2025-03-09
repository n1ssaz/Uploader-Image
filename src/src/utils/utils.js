export function sortFiles(files, sortOption) {
    return [...files].sort((a, b) => {
        switch (sortOption) {
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "date-newest":
                return new Date(b.date) - new Date(a.date);
            case "date-oldest":
                return new Date(a.date) - new Date(b.date);
            case "size-smallest":
                return a.size - b.size;
            case "size-largest":
                return b.size - a.size;
            default:
                return 0;
        }
    });
}

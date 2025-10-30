import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput,
    Button,
} from "@mui/material";

interface DishFiltersProps {
    type: string;
    tags: string[];
    sort: string;
    onTypeChange: (e: any) => void;
    onTagsChange: (e: any) => void;
    onSortChange: (e: any) => void;
    clearFilters: () => void;
    TAGS: string[];
    TYPES: string[];
}

export default function DishFilters({
                                        type,
                                        tags,
                                        sort,
                                        onTypeChange,
                                        onTagsChange,
                                        onSortChange,
                                        clearFilters,
                                        TAGS,
                                        TYPES,
                                    }: DishFiltersProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                mb: 4,
                bgcolor: "rgba(255,255,255,0.9)",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
        >
            <FormControl sx={{ minWidth: 160, bgcolor: "aliceblue", borderRadius: 1 }}>
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={onTypeChange} label="Type">
                    <MenuItem value="">All</MenuItem>
                    {TYPES.map((t) => (
                        <MenuItem key={t} value={t}>
                            {t}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160, bgcolor: "aliceblue", borderRadius: 1 }}>
                <InputLabel>Tags</InputLabel>
                <Select
                    multiple
                    value={tags}
                    onChange={onTagsChange}
                    input={<OutlinedInput label="Tags" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                >
                    {TAGS.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                            {tag}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160, bgcolor: "aliceblue", borderRadius: 1 }}>
                <InputLabel>Sort by</InputLabel>
                <Select value={sort} onChange={onSortChange} label="Sort by">
                    <MenuItem value="price-asc">Price (Low → High)</MenuItem>
                    <MenuItem value="price-desc">Price (High → Low)</MenuItem>
                    <MenuItem value="name-asc">Name (A–Z)</MenuItem>
                    <MenuItem value="name-desc">Name (Z–A)</MenuItem>
                </Select>
            </FormControl>

            <Button variant="outlined" color="secondary" onClick={clearFilters}>
                Clear Filters
            </Button>
        </Box>
    );
}

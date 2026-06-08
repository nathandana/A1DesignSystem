import React from 'react';
export interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
    /** Pages shown either side of the active page before ellipsis */
    siblings?: number;
    size?: 'md' | 'sm';
}
export declare function Pagination({ page, totalPages, onChange, siblings, size }: PaginationProps): React.JSX.Element;

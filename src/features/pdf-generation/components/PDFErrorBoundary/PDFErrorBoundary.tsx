import {Component, type ReactNode} from 'react';

type PDFErrorBoundaryProps = {
    children: ReactNode;
    fallback: ReactNode;
};

type PDFErrorBoundaryState = {
    hasError: boolean;
};

export class PDFErrorBoundary extends Component<PDFErrorBoundaryProps, PDFErrorBoundaryState> {
    state: PDFErrorBoundaryState = {
        hasError: false,
    };

    static getDerivedStateFromError(): PDFErrorBoundaryState {
        return {hasError: true};
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}
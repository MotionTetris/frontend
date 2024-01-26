export const goToPreviousPage = (currentPage: number, dispatch: any, setCurrentPageAction: any) => {
  dispatch(setCurrentPageAction(Math.max(currentPage - 1, 1)));
};
  
export const goToNextPage = (currentPage: number, totalPages: number, dispatch: any, setCurrentPageAction: any) => {
  dispatch(setCurrentPageAction(Math.min(currentPage + 1, totalPages)));
};
  
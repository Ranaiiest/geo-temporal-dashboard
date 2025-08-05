
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';



// A typed version of useDispatch.
export const useAppDispatch = () => useDispatch<AppDispatch>();

// A typed version of useSelector.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
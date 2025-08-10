import { Colors } from "@/constants/Colors";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

export interface ChironBottomSheetHandles {
  open: (index?: number) => void;
  close: () => void;
}

interface ChironBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  panDownClose?: boolean;
  initialIndex?: number;
  handleVisible?: boolean;
  enableScroll?: boolean;
}

const ChironBottomSheet = forwardRef<
  ChironBottomSheetHandles,
  ChironBottomSheetProps
>(
  (
    {
      children,
      snapPoints = ["25%", "50%", "70%", "95%"],
      panDownClose = true,
      initialIndex = -1,
      handleVisible = true,
      enableScroll = true,
    },
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    useImperativeHandle(ref, () => ({
      open: (index = 1) => bottomSheetRef.current?.snapToIndex(index),
      close: () => bottomSheetRef.current?.close(),
    }));

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={memoizedSnapPoints}
        index={initialIndex}
        enablePanDownToClose={panDownClose}
        handleIndicatorStyle={{
          backgroundColor: handleVisible ? Colors.light.primary : "#fff",
        }}
      >
        {enableScroll ? (
          <BottomSheetScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView>{children}</BottomSheetView>
        )}
      </BottomSheet>
    );
  }
);

export default ChironBottomSheet;

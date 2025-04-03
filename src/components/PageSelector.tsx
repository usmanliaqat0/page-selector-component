import { useState, memo, useCallback, useMemo } from "react";

interface Page {
  id: string;
  title: string;
  selected: boolean;
}

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const Checkbox = memo(({ checked, onChange }: CheckboxProps) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer w-[23px] h-[23px] border-2 border-gray-300 rounded-md appearance-none checked:border-[#5087F8] checked:bg-[#5087F8] cursor-pointer"
      />
      <svg
        width="23"
        height="23"
        viewBox="0 0 23 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none opacity-0 peer-checked:opacity-100"
      >
        <path
          d="M3.68 11.592L9.22879 16.5272C9.24925 16.5454 9.28055 16.5437 9.29899 16.5235L19.32 5.52"
          stroke="white"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
});

interface PageItemProps {
  page: Page;
  onCheckboxChange: (pageId: string) => void;
}

const PageItem = memo(({ page, onCheckboxChange }: PageItemProps) => {
  const handleChange = useCallback(() => {
    onCheckboxChange(page.id);
  }, [page.id, onCheckboxChange]);

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[#1F2128] text-sm font-normal leading-[130%] tracking-normal">
        {page.title}
      </span>
      <Checkbox checked={page.selected} onChange={handleChange} />
    </div>
  );
});

const INITIAL_PAGES: Page[] = [
  { id: "all", title: "All pages", selected: false },
  { id: "page1", title: "Page 1", selected: false },
  { id: "page2", title: "Page 2", selected: false },
  { id: "page3", title: "Page 3", selected: false },
  { id: "page4", title: "Page 4", selected: false },
];

export default function PageSelector() {
  const [pages, setPages] = useState<Page[]>(INITIAL_PAGES);
  const [showSelected, setShowSelected] = useState(false);

  const handleCheckboxChange = useCallback((pageId: string) => {
    if (pageId === "all") {
      setPages((prevPages) => {
        const newSelected = !prevPages[0].selected;
        return prevPages.map((page) => ({ ...page, selected: newSelected }));
      });
    } else {
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.id === pageId ? { ...page, selected: !page.selected } : page
        )
      );
    }
  }, []);

  const selectedPages = useMemo(
    () => pages.filter((page) => page.selected),
    [pages]
  );

  const handleDone = useCallback(() => {
    setShowSelected(true);
  }, []);

  const handleAllPagesChange = useCallback(() => {
    handleCheckboxChange("all");
  }, [handleCheckboxChange]);

  const regularPages = useMemo(() => pages.slice(1), [pages]);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[370px] p-[15px] bg-white rounded-md border border-[#EEEEEE] relative shadow-[0px_8px_15px_0px_rgba(20,20,20,0.12),0px_0px_4px_0px_rgba(20,20,20,0.1)]">
        <div className="flex flex-col h-full">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#1F2128] text-sm font-normal leading-[130%] tracking-normal">
                All pages
              </span>
              <Checkbox
                checked={pages[0].selected}
                onChange={handleAllPagesChange}
              />
            </div>
          </div>

          <div className="py-2.5">
            <div className="h-[0.7px] bg-[#CDCDCD] w-full" />
          </div>

          <div className="flex flex-col">
            {regularPages.map((page) => (
              <PageItem
                key={page.id}
                page={page}
                onCheckboxChange={handleCheckboxChange}
              />
            ))}
          </div>

          <div className="py-2.5">
            <div className="h-[0.7px] bg-[#CDCDCD] w-full" />
          </div>

          <div className="py-2.5">
            <button
              onClick={handleDone}
              className="w-full bg-[#FFCE22] text-[#1F2128] px-5 py-2.5 rounded font-normal text-sm leading-[130%] tracking-normal hover:bg-[#FFD84D] transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {showSelected && selectedPages.length > 0 && (
        <div className="w-[370px] p-[15px] bg-white rounded-md border border-[#EEEEEE] shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[#1F2128] text-sm font-medium">
              Selected pages:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedPages.map((page) => (
                <span
                  key={page.id}
                  className="px-2 py-1 bg-[#F5F5F5] rounded text-xs text-[#1F2128]"
                >
                  {page.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

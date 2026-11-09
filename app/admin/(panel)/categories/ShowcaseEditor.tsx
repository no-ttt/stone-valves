"use client";

import { useState } from "react";
import { ItemList, type ListItem } from "@/components/admin/ItemList";
import { saveShowcase } from "@/lib/admin/category-actions";

export function ShowcaseEditor({ initial, categories }: { initial: ListItem[]; categories: { value: string; label: string }[] }) {
  const [items, setItems] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [state, setState] = useState("");

  return (
    <div className="stack">
      <ItemList
        items={items}
        onChange={(next) => {
          setItems(next);
          setDirty(true);
          setState("");
        }}
        nameLabel="產品名稱"
        extra={{ label: "所屬分類", options: categories }}
        addLabel="新增常見產品"
      />
      <div className="row">
        <button
          className="btn btn-primary"
          type="button"
          disabled={!dirty}
          onClick={async () => {
            setState("儲存中…");
            await saveShowcase(items.map((it) => ({ name: it.name, image: it.image, categorySlug: it.extra ?? "" })));
            setDirty(false);
            setState("已儲存。沒有名稱或圖片的項目不會儲存。");
          }}
        >
          儲存常見產品
        </button>
        <span className="muted" role="status">
          {dirty ? "有尚未儲存的變更" : state}
        </span>
      </div>
    </div>
  );
}

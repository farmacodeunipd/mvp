import React, { useCallback, useState } from 'react';
import { DataScroller } from 'primereact/datascroller';

const ItemTemplate = (data) => (
  <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
    <div style={{ fontWeight: 'bold' }}>ID</div>
    <div>{data.id}</div>
    <div style={{ fontWeight: 'bold' }}>NAME</div>
    <div>{data.name}</div>
  </div>
);

export default function CatCli() {
  const [products, setProducts] = useState([]);

  const loadData = useCallback(async ({ first, rows }) => {
    // How do you increase "first" ?
    console.log(JSON.stringify({ first, rows }));

    const data = Array.from(new Array(rows)).map((_, i) => ({
      id: i + first,
      name: `name-${i + first}`,
    }));
    setProducts((prev) => [...prev, ...data]);
  }, []);

  return (
    <div style={{ border: '1px solid black' }}>
      <DataScroller
        value={products}
        itemTemplate={ItemTemplate}
        rows={20}
        inline
        scrollHeight="400px"
        header="Scroll Down to Load More"
        lazy
        onLazyLoad={loadData}
      />
    </div>
  );
}


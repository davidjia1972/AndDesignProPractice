import React from 'react';
import { Table, Button } from 'antd';

const data = [{
  key: '1',
  name: '张三',
  age: 22,
  address: '浙江省温州市',
}, {
  key: '2',
  name: '李四',
  age: 42,
  address: '湖南省湘潭市',
}, {
  key: '3',
  name: '王五',
  age: 12,
  address: '四川省成都市',
}, {
  key: '4',
  name: '赵六',
  age: 25,
  address: '河南省郑州市',
}, {
  key: '5',
  name: '宋二',
  age: 74,
  address: '海南省海口市',
}, {
  key: '6',
  name: '韩八',
  age: 19,
  address: '台湾省台北市',
}, {
  key: '7',
  name: '孙七',
  age: 55,
  address: '福建省福州市',
}, {
  key: '8',
  name: '金九',
  age: 81,
  address: '山西省运城市',
}];

class SortTable extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
  };
  handleChange = (pagination, filters, sorter) => {
    //pagination:{current: 1, pageSize: 10}
    //filters:{name: null, address: null}
    //sorter:{column: {…}, order: "ascend", field: "name", columnKey: "name"}
    console.log('Various parameters', pagination);
    console.log('Various parameters', filters);
    console.log('Various parameters', sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };
  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };
  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };
  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    });
  };
  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [{
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      filters: [
        { text: '孙', value: '孙' },
        { text: '赵', value: '赵' },
      ],
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value),
      //sorter: (a, b) => a.name.length - b.name.length,
      sorter: (a, b) => a.name.localeCompare(b.name),//排序规则
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
    }, {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      filters: [ //筛选条件
        { text: '浙江省', value: '浙江省' },
        { text: '市', value: '市' },
      ],
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => {
        console.log(value,"value"); //浙江省 value
        console.log(record,"record");//{key: "2", name: "李四", age: 42, address: "湖南省湘潭市"} 遍历数据 
        return record.address.includes(value);//所有的数据中 包含value(浙江省)的筛选出来
      },
      //sorter: (a, b) => a.address.length - b.address.length,
      sorter: (a,b)=>(a.address).localeCompare(b.address), 
      sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
    }];
    return (
      <div>
        <div className="table-operations">
          <Button onClick={this.setAgeSort}>年龄排序</Button>
          <Button onClick={this.clearFilters}>清除筛选</Button>
          <Button onClick={this.clearAll}>清除筛选和年龄排序</Button>
        </div>
        {/*columns标题栏  dataSource内容栏根据标题填充数据*/}
        <Table columns={columns} dataSource={data} onChange={this.handleChange} />
      </div>
    );
  }
}

export default SortTable;
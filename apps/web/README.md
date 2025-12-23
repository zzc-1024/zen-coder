# 如何设计节点

节点的视图设计需要引用`apps\web\src\components\node`下的组件。

节点的模型应该继承`apps\web\src\nodes\basic\basicNodeModel.ts`这里的model，并设置行数和默认锚点。示例Model定义如下：

```ts
class GetNodeModel extends BasicNodeModel {
  /**
   * 设置节点的基础属性
   * LogicFlow 会在初始化和属性更新时调用此方法
   */
  setAttributes() {
    super.setAttributes();
    this.setNodeHeightByRowCount(2);
  }

  /**
   * 进阶：自定义锚点
   * 让每个字段的左右两侧都能连线
   */
  getDefaultAnchor() {
    const anchors: Model.AnchorConfig[] = [];

    const properties = this.properties as GetNodeProperties;
    anchors.push(this.generateAnchorConfig(0, 'in', 'builtin:basic:flow', 'flow-in'));
    anchors.push(this.generateAnchorConfig(0, 'out', 'builtin:basic:flow', 'flow-out'));
    anchors.push(this.generateAnchorConfig(1, 'in', parseType(properties.type), 'data-in'));

    return anchors;
  }
}
```

设计好的节点，需要在`apps\web\src\nodes\basic\basicEditorConfig.ts`中注册。如果需要在变量列表中拖拽的话，需要在`apps\web\src\components\variableList\variableList.ts`中注册。

# 关于类型系统

类型系统使用字符串传参，构造时需要使用类的`toString`方法构造，如：

```ts
const type = new BasicType('builtin:basic:string').toString();
```

可以使用`parseType`方法将字符串转换为类型对象

```ts
const type = parseType('builtin:basic:string');
```

平时默认使用字符串传递参数，当需要使用类型对象时在组件内部自行转换，不要在组件之间传递。

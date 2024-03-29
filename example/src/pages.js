const pages = [
  {
    slug: 'flex',
    title: 'Flex',
    from: 'Flex',
    group: 'Layout',
    smallCode: `<Flex row w={160} justifyContent="space-between">
        <Flex bg="primary" w={50} h={50} />
        <Flex bg="primary:setAlpha:0.66" w={50} h={50} />
      </Flex>`,
    code: ``,
  },
  {
    slug: 'text',
    title: 'Text',
    from: 'Text',
    group: 'Layout',
    smallCode: `<Flex center>
        <Text font="h1">Headline</Text>
        <Text font="h3">Subheadline</Text>
        <Text font="p">Paragraph</Text>
        <Text font="label">Label</Text>
    </Flex>`,
    code: ``,
  },
  {
    slug: 'grid',
    title: 'Grid',
    from: 'Grid',
    group: 'Layout',
    smallCode: `<Grid w={160} min={50} gap={5}>
      <Flex bg="primary" w="100%" h={50} />
      <Flex bg="primary:setAlpha:0.66" w="100%" h={50} />
      <Flex bg="primary:setAlpha:0.33" w="100%" h={50} />
    </Grid>`,
    code: `<Grid w="100%" min={100} gap={5}>
    <Flex bg="primary" w="100%" h={50} />
    <Flex bg="primary" w="100%" h={50} />
    <Flex bg="primary" w="100%" h={50} />
  </Grid>;`,
  },
  {
    slug: 'draggable',
    title: 'Draggable',
    from: 'Draggable',
    group: 'Layout',
    smallCode: `<Flex flex={1} flexCenter>
        <Draggable direction="x" minX={-100} maxX={100} snapFactor={50} snapToStart snapTo={[{ x: -100 }, { x: 100 }]}>{({dragging}) => (<Animate to={{scale:dragging? 1.2:1 }} bg="primary" w={50} h={50} borderRadius={25} center><Text>{dragging ? "drag": ""}</Text></Animate>)}</Draggable>
      </Flex>`,
    code: ``,
  },
  {
    slug: 'pointer',
    title: 'Pointer',
    from: 'Pointer',
    group: 'Layout',
    smallCode: `<Flex flex={1} flexCenter>
        <Pointer fromCenter={true}>
          {({x,xProgress,y,yProgress}) => (
            <Flex bg="primary" w={150} h={150} borderRadius={5} center>
              <Text color="#FFF">{"x: " + x}</Text>
              <Text color="#FFF">{"xProgress: " + xProgress}</Text>
              <Text color="#FFF">{"y: " + y}</Text>
              <Text color="#FFF">{"yProgress: " + yProgress}</Text>
            </Flex>
            )}
        </Pointer>
      </Flex>`,
    code: ``,
  },
  {
    slug: 'group',
    title: 'Group',
    from: 'Group',
    group: 'Layout',
    smallCode: `<Group><Button size={40} rounded>Button</Button><Button size={40} rounded>Button</Button></Group>`,
    code: `<><Flex p={30}>
      <Group gap={1}>
          <Button>Label</Button>
       
          <Button>Label</Button>
      </Group>
  </Flex>
  <Flex bg="primary:setAlpha:0.1"  p={30} flexCenter>
      <Text level={2}>Welcome back</Text>
      <Text o={0.5}>Login with your credentials</Text>
      <Form maxWidth={600} buttonProps={{mt: 15}} onSubmit={(doc, reset) => {
          alert(JSON.stringify(doc))
          reset()
      }}>
      <Group mt={30} vertical >
          <Input type="text" placeholder="E-Mail" field="mail" />
          <Input type="password" placeholder="Password" field="pw" />
      </Group>
      </Form>
  </Flex></>`,
  },
  {
    slug: 'button',
    title: 'Button',
    from: 'Button',
    group: 'Interface',
    smallCode: `<Button gradient>Button</Button>`,
    code: `<Grid gap={30} min={120}>
      <Button onPress={() => theme.alert({type: "success", message: "Hi"})}>Primary</Button>
      <Button animateMode="scale"onPress={() => {}} gradient rounded ripple>Rounded</Button>
      <Button animateMode="scale"onPress={() => {}} gradient={['red',"orange"]} rounded ripple>Gradient</Button>
      <Button light>Light</Button>
      <Button clean>Clean</Button>
      <Button bg="primary:lighten:15" onPress={() => {}} ripple>Ripple</Button>
      <Button bg="primary:darken:10">Darken</Button>
      <Button bg="primary:saturate:20">Saturate</Button>
      <Button bg="error">Error</Button>
      <Button bg="error" light>Light error</Button>
      <Button bg="twitter" renderLeft={<Icon name="twitter" color="#FFF" strokeWidth={1.5} size={22} mr={7} />} ripple>Twitter</Button>
      <Button light loading>Loading</Button>
      <Button progress={50}>Progress</Button>
    </Grid>`,
  },
  {
    slug: 'ripple',
    title: 'Ripple',
    from: 'Ripple',
    group: 'Interface',
    smallCode: `<Flex flex={1}><Flex w={50} h={50} borderRadius={25} bg="primary:setAlpha:0.25" /></Flex>`,
    code: `<Flex bg="primary" w={200} h={200}>
      <Ripple color="primary:darken:5" flex={1} />
    </Flex>`,
  },
  {
    slug: 'icon',
    title: 'Icon',
    desc: 'Feather Icons as paths. Add animate prop to start a path animation.',
    from: 'Icon',
    group: 'Interface',
    smallCode: `<Icon size={60} strokeWidth={1} animate />`,
    codeProps: { hideEditor: true },
    code: `function render() {
      const names = Object.keys(Icons);
      const [index, setIndex] = useState(0);
      useInterval(() => {
        setIndex((index + 1) % names.length);
      }, 2500);
      return (
        <Flex alignItems="center" w="100%" p={30}>
          <Flex alignItems="center" w="100%" py={50}>
            <Animate from={{scale:0.5}} to={{scale:1}} duration={2000} key={names[index]}>
            <Icon size={150} strokeWidth={0.5} name={names[index]} animate />
            </Animate>
            <Flex mt={10} bg="text" p={10} borderRadius={8}>
              <Text font="Code" color="surface">{'<Icon name="..." size={150} strokeWidth={0.5} delay={250} animate />'}</Text>
            </Flex>
           
          </Flex>
          <Grid min={150} w="100%">
            {names.map(name => (
                <Flex key={name} flexCenter my={20} w="100%">
                  <Icon name={name} />
                  <Text mt={10}>{name}</Text>
                </Flex>
              ))}
          </Grid>
        </Flex>
      );
    }`,
  },
  {
    slug: 'progress',
    title: 'Progress',
    from: 'Progress',
    group: 'Interface',
    smallCode: `<Progress size={70} value={66} />`,
    code: `function RenderIcon() {
      const [value, setValue] = useState(33);
      useInterval(() => {
        setValue(Math.floor(Math.random() * 99) + 1);
      }, 2500);
      return (
         
    <Flex flex={1} row wrap flexCenter>

    <Progress
      mx={25}
      value={80}
      size={70}
      angle={180}
      formatValue={v => v + "%"}
      progressColor="success"
      showValue
    />
    <Progress
    mx={25}
      value={value}
      size={100}
      trackWidth={9}
      progressWidth={6}
      formatValue={v => v + "%"}
      showValue
    />
    <Progress mx={25} trackWidth={7}
    progressWidth={6} loading />

  </Flex>
      );
    }`,
  },
  {
    slug: 'avatar',
    title: 'Avatar',
    from: 'Avatar',
    group: 'Interface',
    smallCode: `<Avatar size={66} char="UK" shadow={10} shadowColor="rgba(0,0,0,0.2)" source={{uri: "https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"}} />`,
    code: `<Flex flex={1} row wrap center>
    <Avatar gradient mx={10} bg="primary" char="UK" />
    <Avatar gradient mx={10} bg="primary" char="UK"><Icon name="zap" size={24} color="#FFF" /></Avatar>
    <Avatar
    mx={10}
      size={66}
      shadow={10}
      shadowColor="rgba(0,0,0,0.2)"
      onPress={() => theme.alert({type: "success", message:"Hi"})}
      source={{
        uri:
          "https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
      }}
    />
    <Avatar
    mx={10}
      size={66}
      char="IK"
      source={{
        uri:
          "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
      }}
    />
    <Avatar  mx={10} bg="success" darken={0.5} char="IT" />
  </Flex>;`,
  },
  {
    slug: 'collapsible',
    title: 'Collapsible',
    from: 'Collapsible',
    group: 'Interface',
    smallCode: `<Collapsible triggerProps={{gradient:true}}><Flex bg="primary" w={20} h={20} /></Collapsible>`,
    code: `<Flex>
    <Collapsible  triggerProps={{gradient:true}} trigger="#1"><Flex bg="primary" w={100} h={100} /></Collapsible>
    <Collapsible trigger="#2" mt={5}><Flex bg="primary" w={100} h={100} /></Collapsible>
    </Flex>`,
  },
  {
    slug: 'overlay',
    title: 'Overlay',
    from: 'Overlay',
    group: 'Interface',
    smallCode: `<Flex width="100%" flexCenter><Button rounded>Overlay</Button></Flex>`,
    code: `function RenderIcon() {
      const [visible, setVisible] = useState(false);

      return (
        <Flex width="100%" flexCenter py={100}>
        <Button  onPress={() => setVisible(true)} rounded>Show</Button>
        <Overlay
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <Button  onPress={() => setVisible(false)}>Close</Button>
        </Overlay>
        </Flex>
      );
    }`,
  },
  {
    slug: 'dropdown',
    title: 'Dropdown',
    from: 'Dropdown',
    group: 'Interface',
    smallCode: `<Flex width="100%" flexCenter><Button rounded><Icon name="chevron-down" color="#FFF" size={20} /></Button></Flex>`,
    code: `<Flex width="100%" flexCenter py={100}><Dropdown
    wrapperProps={{
      w: 250,
      r: 0,
      t: 50
    }}
    content={<>
      <Button width={300} onPress={() => theme.alert({type: "primary",message: "Hi!"})}>Content</Button>
      <Button  width={300} onPress={() => theme.alert({ type: "primary", message: "Hi!"})}>Content</Button>
      </>}>
    <Button><Icon name="chevron-down" color="#FFF" size={20} /></Button>
    </Dropdown></Flex>`,
  },
  {
    slug: 'tooltip',
    title: 'Tooltip',
    from: 'Tooltip',
    group: 'Interface',
    smallCode: `<Flex width="100%" flexCenter><Button rounded>Tooltip</Button></Flex>`,
    code: `<Flex width="100%" flexCenter py={100}>
    <Tooltip
    position="center"
    mr={10}
    popover={<Flex w="100%">
      <Button onPress={() => theme.alert({type: "primary",message: "Hi!"})}>Content</Button>
      <Button   onPress={() => theme.alert({ type: "primary", message: "Hi!"})}>Content</Button>
      </Flex>}>
    <Button><Icon name="chevron-down" color="#FFF" size={20} /></Button>
    </Tooltip>
    </Flex>`,
  },
  // {
  //   slug: 'alert',
  //   title: 'Alert',
  //   from: 'Alert',
  //   group: 'Interface',
  //   smallCode: `<Button onPress={() => theme.alert({type: "primary",message: "Hi"})} rounded><Icon name="bell" color="#FFF" size={20} /></Button>`,
  //   code: `<Grid gap={30} min={120}>
  //     <Button onPress={() => theme.alert({message: "Hi"})}>Clean</Button>
  //     <Button bg="error"  onPress={() => theme.alert({type: "error", backdrop: true, message: "Hi", timeout: false})}>Error</Button>
  //     <Button bg="success" onPress={() => theme.alert({type: "success", position: "center", message: "Hi"})}>Success</Button>
  //     <Button light onPress={() => theme.alert({loading: true, message: "Loading"})}>Loading</Button>
  //     <Button light onPress={() => {
  //      theme.alert({ type: "primary", position: "center",confirm: true, onClose: () => alert("onClose"), onConfirm: ({key}) => {

  //         theme.alert({ key, type: "success", confirm: false, loading: true, message:"Loading", timeout: 2000 });
  //       }, backdrop: true, title: "unikit", message: "Do you like unikit?" });

  //     }}>Confirm</Button>
  //     <Button light onPress={() => theme.alert({  type: "surface:setAlpha:0.8", color: "primary",position: "bottom",actionSheet: true, backdrop: true, actions: [{icon: "zap", label: "Zap"},{icon: "edit", label: "Edit"},{icon: "mapPin", label: "Pin"}] })}>ActionSheet</Button>
  //   </Grid>`,
  // },
  // {
  //   slug: 'picker',
  //   title: 'Picker',
  //   from: 'Picker',
  //   group: 'Interface',
  //   smallCode: `<Flex w="80%"><Picker useScrollView /></Flex>`,
  //   code: `<Flex><Picker onChange={(value) => console.log({value})} useScrollView /></Flex>`,
  // },
  {
    slug: 'tabs',
    title: 'Tabs',
    from: 'Tabs',
    group: 'Interface',
    smallCode: `<Tabs w="100%" size={44} options={['Tab 1', 'Tab 2']} />`,
    code: `<Flex align="center">
    <Tabs
      value="Tab 2"
      options={["Tab 1", "Tab 2", "Tab 3"]}
      onChange={value => theme.alert({type: "primary", message: value})}
      indicatorSize={3}
      activeColor="primary"
      inactiveColor="primary:setAlpha:0.5"
      indicatorOffset="100%"
      borderBottomWidth={3}
      borderBottomColor="primary:setAlpha:0.25"
    />
    <Tabs
      mt={50}
      options={[
        { label: "Tab 1", value: 0 },
        { label: "Tab 2", value: 1 }
      ]}
      indicatorSize="100%"
      activeColor="#FFF"
      roundness={40}
    />
    <Tabs
    mt={50}
    roundness={40}
    tabProps={{ripple: true}}
          options={[
            {
              value: '1',
              label: ({ color,active }) => <Icon name="sun" size={20} color={color} animate={active} />,
            },
            {
              value: '2',
              label: ({ color, active }) => (
                <Icon  name="moon" size={20} color={color}  animate={active} />
              ),
            },
          ]}
        />
    <Tabs
      bg="transparent"
      vertical
      mt={50}
      options={["Tab 1", "Tab 2", "Tab 3"]}
      tabProps={{ justifyContent: "flex-start" }}
      roundness={0}
    />
  </Flex>;
  `,
  },
  // {
  //   slug: 'piechart',
  //   title: 'PieChart',
  //   from: 'PieChart',
  //   group: 'Interface',
  //   smallCode: `<PieChart data={[{value:15},{value: 25},{value:50}]} size={100} />`,
  //   code: `<Flex w="100%" row justifyContent="space-around" p={10}>
  //     <PieChart showValue valueAsPercent title="Title" data={[{value:15, label: "A", fill: "success", arc: { outerRadius: '90%'}},{value: 25, label: "B", image:"https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"},{value:50, label: "C", image:"https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"}]} size={200} legend />
  //     <PieChart data={[{value:15, onPress: (d) => alert(d)},{value: 25},{value:50}]} size={100} startAngle={Math.PI * 1.5} endAngle={Math.PI * 2.5} />
  //     <PieChart data={[{value:15},{value: 25},{value:35}]} color="error" size={200} innerRadius="90%" cornerRadius={20} />
  //   </Flex>`,
  // },
  {
    slug: 'chart',
    title: 'Chart',
    from: 'Chart',
    group: 'Interface',
    smallCode: `<Flex w="100%" h={80}><Chart
    data={[1, 2, 3, 1, 2, 3]}
    height={80}
  >
    <Chart.Line />
  </Chart></Flex>`,
    code: `<Flex p={10}>
    <Flex mt={10}>

      <Chart
        data={[1, 2, 3, 1, 2, 3]}
        xAxis
        yAxis
        yTicks={4}
        height={200}
        wrapperProps={{
          bg: "surface",
          borderRadius: 15,
          shadow: 3,
          mb: 5,
        }}
      >
        <Chart.Grid />
        <Chart.Indicator color="primary:setAlpha:0.5" />
        <Chart.Line onChange={({value, index}) => console.log(value)} />

      </Chart>
  
    </Flex>
    <Flex mt={50}>
      <Chart
      useScaleBand
      xAxis

        data={[
          {
            test: 10,
            test2: 12,
          },
          {
            test: 15,
            test2: 5,
          },
          {
            test: 14,
            test2: 33,
          },
          {
            test: 10,
            test2: 12,
          },
          {
            test: 15,
            test2: 5,
          },
          {
            label: "Dez",
            test: 14,
            test2: 33,
          },
          {
            test: 10,
            test2: 12,
          },
          {
            test: 15,
            test2: 5,
          },
          {
            test: 14,
            test2: 33,
            test3: 25,
          },
        ]}
        height={200}
        wrapperProps={{
          bg: "surface",
          borderRadius: 15,
          shadow: 3,
          mb: 5,
        }}
      >

        <Chart.Bar
          color="primary:setAlpha:0.1"
          activeColor="primary:setAlpha:0.85"
          activeIndex={8}
          dataKey="test2"
          showValue
          onChange={({ value, index }) => console.log(value)}
        />

        <Chart.Line dataKey="test" showValue gradient={false}  />
        <Chart.Indicator />
      </Chart>
    </Flex>
    <Flex mt={50}>
      <Chart
      useScaleBand
      xAxis
      data={[1, 2, 3, 1, 2, 3]}
        height={200}
        wrapperProps={{
          bg: "surface",
          borderRadius: 15,
          shadow: 3,
          mb: 5,
        }}
      >
      <Chart.Indicator />
      <Chart.GridLine value={2} color="primary" gridDasharray={5} />
        <Chart.Bar
          color="primary:setAlpha:0.1"
          activeColor="primary:setAlpha:0.85"
          barSize={25}
          showActiveValue
          onChange={({ value, index }) => console.log(value)}
        />

      </Chart>
    </Flex>
    </Flex>`,
  },
  {
    slug: 'tilt',
    title: 'Tilt',
    from: 'Tilt',
    group: 'Interface',
    smallCode: `<Flex p={20} w="100%" center>
      <Tilt>
        <Avatar char="U" size={150} source={{uri: "https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"}}  />
      </Tilt>
    </Flex>`,
    code: `<>
    <Flex p={20} w="100%" center>
      <Tilt>
        <Avatar char="M" size={150} source={{uri: "https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"}}  />
      </Tilt>
    </Flex>
    <Flex p={20} w="100%" center>
      <Tilt mouse={false} reverse>
        <Avatar char="PAN" size={150} source={{uri: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"}}  />
      </Tilt>
    </Flex>
    </>`,
  },
  {
    slug: 'swiper',
    title: 'Swiper',
    from: 'Swiper',
    group: 'Interface',
    smallCode: `<Swiper w={160} h={100} inactiveScale={0.2} arrows dots autoplay>
    <Flex bg="primary:setAlpha:0.75" flex={1} />
    <Flex bg="primary:setAlpha:0.5"  flex={1} />
    <Flex bg="primary:setAlpha:0.25"  flex={1} />
  </Swiper>`,
    code: `function render() {
      const [date, setDate] = useState(new Date());

      return (<Flex flex={1}>
        <Swiper w="100%" h={200} my={10} arrows dots autoplay>
    <Flex bg="primary:setAlpha:0.75" flex={1} />
    <Flex bg="primary:setAlpha:0.5"  flex={1} />
    <Flex bg="primary:setAlpha:0.25"  flex={1} />
  </Swiper>
  <Swiper w="100%" h={200} my={10} dots snapTo="center"  itemDimension={300}>
    <Flex bg="primary:setAlpha:0.75" flex={1} />
    <Flex bg="primary:setAlpha:0.75" flex={1} />
    <Flex bg="primary:setAlpha:0.5"  flex={1} />
    <Flex bg="primary:setAlpha:0.25"  flex={1} />
  </Swiper>
  <Swiper w="100%" h={200} my={10} dots gap={30} itemDimension={300}>
    <Flex bg="primary:setAlpha:0.75" flex={1} />
    <Flex bg="primary:setAlpha:0.75" flex={1} />
    <Flex bg="primary:setAlpha:0.5"  flex={1} />
    <Flex bg="primary:setAlpha:0.25"  flex={1} />
  </Swiper>
  <Swiper w="100%" h={400} my={10} dots snapTo="center"  itemDimension={250} vertical>
  <Flex bg="primary:setAlpha:0.75" flex={1} />
  <Flex bg="primary:setAlpha:0.5"  flex={1} />
  <Flex bg="primary:setAlpha:0.25"  flex={1} />
</Swiper>
  </Flex>
  )}`,
  },
  {
    slug: 'input',
    title: 'Input',
    from: 'Input',
    group: 'Inputs',
    smallCode: `<Input type="text" label="Sunny" placeholder="text"  inline icon="sun"  />`,
    code: `<Flex w="100%" flexCenter>
      <Form inputProps={{mb:10}} defaultDoc={{date: "2020-11-25T06:00:00.000Z", datetime: "2020-11-25T06:00:00.000Z"}}  onSubmit={doc => alert(JSON.stringify(doc))} clean>
      <Input label="Custom input" field="custom" clean>
        <Flex width={100} height={100} bg="primary"></Flex>
      </Input>
      <Input type="text" label="Text" placeholder="text"  field="text" clean needsDoc  />
      <Input type="password" label="Password" placeholder="password"  field="password" clean  />
      <Input type="date" label="Date"  defaultValue={new Date()}  field="date" clean  />
      <Input type="timeago" label="Timeago"  defaultValue={new Date()}  field="timeago" clean  />
      <Input type="time" label="Time"  defaultValue={new Date()}  field="time" clean  />
      <Input type="datetime" label="Datetime"  defaultValue={new Date()}  field="datetime" clean  />
      <Input type="phone" error label="Phone"  field="phone" clean  />
      <Input type="textarea" label="Textarea" placeholder="text"  field="textarea" clean  />
      <Input type="number" label="Number" placeholder="number" defaultValue={0.9}  field="number" clean  />
      <Input type="tabs" label="Tabs" options={["unikit", "is awesome"]}  field="tabs" clean  />
      <Input type="text" label="Inline" placeholder="text" mt={10} field="inline" inline clean  />
      <Input type="switch" mt={10} label="Sunny" placeholder="text" icon="sun" field="switch" clean   />
      <Input type="range" mt={10} label="Sunny"  field="range" clean  />
      <Input type="tags" mt={10} label="Tags"  field="tags" clean  />
      <Input type="color" mt={10} label="Color" defaultValue="red"  field="color" clean  />
      <Input type="select" options={["unikit", "is awesome"]} mt={10} label="Select"  field="select" clean  />
      <Input type="select" options={["unikit", "is awesome"]} mt={10} label="Select"  field="selectinline"  picker="switch"  />
      <Input type="select" options={[{label: <Flex flexCenter row><Flex w={34} h={34} bg="primary" borderRadius={22} /><Text ml={5}>Unikit</Text></Flex>, value: "unikit"}, {label: "is awesome", value: "is awesome"}]} mt={10} label="MultiSelect with array value" bg="transparent" field="selectpicker" inline picker="checkbox"  multi    />
      <Input type="select" options={[{label:"unikit", value: "unikit"}, {label:"is awesome", value: "awesome"}]} mt={10} label="MultiSelect with object value" field="selectobject" multi responseType="object" picker="switch"  />
      <Input type="text" mt={10} label="Label" placeholder="text" field="normal" clean />
      <Input type="file" mt={10} label="File" defaultValue={"https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"} field="file" clean />
      <Input type="file" mt={10} label="File" defaultValue={["https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60", "https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"]} field="file2" multi clean />
      </Form>
    </Flex>`,
  },
  {
    slug: 'codefield',
    title: 'CodeField',
    from: 'CodeField',
    group: 'Inputs',
    smallCode: `<CodeField  width="80%" cells={4}  />`,
    code: `<Form>
      <Input label="Code Field" mt={10} clean>
      <CodeField field="code" autoFocus />
      </Input>
      <Input label="Secure Text" mt={10} clean>
      <CodeField field="code2" cells={4} maxWidth={300} secureTextEntry />
      </Input>
      <Input label="Clean" mt={10} clean>
      <CodeField  field="code3" cells={4} gap={0} maxWidth={300} clean secureTextEntry />
      </Input>
      <Input label="Custom" mt={10} clean>
      <CodeField  field="code4" cells={3} customCursor={<Icon name="zap" size={22} />}  />
      </Input>
    </Form>`,
  },
  {
    slug: 'textinput',
    title: 'TextInput',
    from: 'TextInput',
    group: 'Inputs',
    smallCode: `<TextInput placeholder="text" width="80%"  />`,
    code: `<Flex w="100%" flexCenter><TextInput placeholder="text" width="80%"  /></Flex>`,
  },
  {
    slug: 'slider',
    title: 'Slider',
    from: 'Slider',
    group: 'Inputs',
    smallCode: `<Slider w="80%" value={30} />`,
    code: `<Flex width="100%" flexCenter>
    <Form button={false}  w="80%" >

      <Slider progressColor="success" hideValue={false} my={30}  defaultValue={10} field="s0" />
      <Slider hideValue={false} my={30}  steps={20} defaultValue={20} field="s1" />
      <Slider
        my={30}

        defaultValue={20}
        handleFocusOpacity={0.1}
        showTicks={false}
        showValue={false}
        trackHeight={50}
        handleSize={50}
        showHandle={false}
        handleColor="transparent"
        field="s2"
      />
      <Slider my={30} showValue min={20} max={80} formatValue={v => v + "%"}  steps={20} defaultValue={[20, 40]}  field="s3" />

    </Form>
  </Flex>;`,
  },
  {
    slug: 'switch',
    title: 'Switch',
    from: 'Switch',
    group: 'Inputs',
    smallCode: `<Form button={false} flexCenter><Switch value={true} field="switch" /></Form>`,
    code: `function render() {
      const [value, setValue] = useState(true);
      return (
        <Flex flex={1} row wrap center>
          <Switch mx={10} value={value} onChange={v => setValue(v)} />
          <Switch mx={10} value={value} size={60} onChange={v => setValue(v)} />
          <Switch mx={10} value={value} roundness={0} activeTrackColor="success" onChange={v => setValue(v)} />
        </Flex>
      );
    }`,
  },
  {
    slug: 'color',
    title: 'Color',
    from: 'Color',
    group: 'Inputs',
    smallCode: `<Form button={false}><Flex w="100%" flexCenter><Color field="color" defaultValue="#673fb4" /></Flex></Form>`,
    code: `<Form button={false}><Flex w="100%" flexCenter><Color field="color" defaultValue="#673fb4" /></Flex></Form>`,
  },
  {
    slug: 'checkbox',
    title: 'Checkbox',
    from: 'Checkbox',
    group: 'Inputs',
    smallCode: `<Checkbox size={40} />`,
    code: `<Checkbox size={40} />`,
  },
  {
    slug: 'number',
    title: 'Number',
    from: 'Number',
    group: 'Inputs',
    smallCode: `<Form button={false}><Number w="80%" defaultValue={5}  bg="input" field="num" /></Form>`,
    code: `<Form button={false}><Number w="80%" defaultValue={5}  bg="input" field="num" /></Form>`,
  },
  {
    slug: 'draw',
    title: 'Draw',
    from: 'Draw',
    group: 'Inputs',
    smallCode: `<Form button={false}><Draw w="80%"  bg="input" field="num" /></Form>`,
  },
  {
    slug: 'select',
    title: 'Select',
    from: 'Select',
    group: 'Inputs',
    smallCode: `<Select options={["unikit", "is awesome"]} />`,
    code: `<Form button={false}>
      <Text mt={20}>Normal</Text>
      <Select mt={10} options={["unikit", "is awesome"]} field="select" />
      <Select mt={10} options={["unikit", "is awesome"]} picker="switch" field="selectSwitch" />
      <Select mt={10} options={["unikit", "is awesome"]} picker="checkbox" field="selectCheckboox" />
      <Select mt={10} options={["1", "2", "2", "3", "4", "5", "6","7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"]} field="selectNumber" scrollable />
      <Text mt={20}>Multi</Text>
      <Select mt={10} options={["unikit", "is awesome","select me too"]} picker="checkbox" multi field="selectCheckboxMulti" />
      <Text mt={20}>Multi inline</Text>
      <Select mt={10} options={["unikit", "is awesome","select me too"]} picker="switch" multi inline field="selectCheckboxMultiInline" />
    </Form>`,
  },
  {
    slug: 'datepicker',
    title: 'DatePicker',
    from: 'DatePicker',
    group: 'Inputs',
    smallCode: `<DatePicker  />`,
    code: `<Form><DatePicker field="date"  /><DatePicker time mt={10}  /></Form>`,
  },
  {
    slug: 'image',
    title: 'Image',
    from: 'Image',
    group: 'Layout',
    smallCode: `<Image source={{uri: "https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"}} height={100} lazy  />`,
    code: `<Flex flexCenter py={100}>
      <Image source={{uri: "https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"}} width={200} lazy  />
      <Image mt={100} source={{uri: "https://images.unsplash.com/photo-1601451977966-85a9e242c7b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"}} width="75%" lazy  />
      <Image mt={100} source={{uri: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"}} height={400} lazy  />
    </Flex>`,
  },
];

module.exports.pages = pages;

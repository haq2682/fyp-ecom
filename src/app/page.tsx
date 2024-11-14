import Image from "next/image";
import React from 'react';
import {
  Button, Tooltip, Popover, Menubar, Tabs, Accordion, Toggle, Avatar, Skeleton,
  Input, Alert, Sidebar, Card, Carousel, Checkbox, Switch, Slider, Progress, Toast, Radio, Dialog, DropdownMenu, Breadcrumb
} from '@/components/ui';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Buttons, Tooltip, Popover, Menubar, Tabs, Accordion, Toggle, Avatar, Skeleton */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons</h2>
        <div className="flex space-x-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tooltip</h2>
        <Tooltip content="This is a tooltip">
          <Button>Hover me</Button>
        </Tooltip>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Popover</h2>
        <Popover
          trigger="click"
          content={
            <div className="p-4 space-y-2">
              <p>This is a popover</p>
              <Button variant="secondary">Action</Button>
            </div>
          }
        >
          <Button>Open Popover</Button>
        </Popover>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Menubar</h2>
        <Menubar
          items={[
            { label: 'File', menu: [{ label: 'New' }, { label: 'Open' }, { label: 'Save' }] },
            { label: 'Edit', menu: [{ label: 'Copy' }, { label: 'Paste' }, { label: 'Delete' }] },
            { label: 'Help', menu: [{ label: 'Documentation' }, { label: 'Contact' }] },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tabs</h2>
        <Tabs
          tabs={[
            { label: 'Tab 1', content: <div>Content for Tab 1</div> },
            { label: 'Tab 2', content: <div>Content for Tab 2</div> },
            { label: 'Tab 3', content: <div>Content for Tab 3</div> },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Accordion</h2>
        <Accordion>
          <Accordion.Item value="item-1">
            <Accordion.Header>Accordion Item 1</Accordion.Header>
            <Accordion.Content>Content for Accordion Item 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>Accordion Item 2</Accordion.Header>
            <Accordion.Content>Content for Accordion Item 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Toggle</h2>
        <Toggle>Toggle me</Toggle>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Avatar</h2>
        <div className="flex space-x-4">
          <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80"
            alt="Avatar"
          />
          <Avatar
            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80"
            alt="Avatar"
          />
          <Avatar
            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80"
            alt="Avatar"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Skeleton</h2>
        <div className="flex items-center space-x-4">
          <Skeleton className="w-24 h-24" />
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-40 h-6" />
        </div>
      </div>

      {/* Input, Alert, Sidebar, Card, Carousel, Checkbox, Switch, Slider, Progress, Toast, Radio */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Input</h2>
        <Input placeholder="Enter text" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Alert</h2>
        <Alert variant="success">Success alert</Alert>
        <Alert variant="warning">Warning alert</Alert>
        <Alert variant="danger">Danger alert</Alert>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Sidebar</h2>
        <Sidebar>
          <Sidebar.Item href="#" label="Home" />
          <Sidebar.Item href="#" label="About" />
          <Sidebar.Item href="#" label="Contact" />
        </Sidebar>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Card</h2>
        <Card>
          <Card.Header>
            <Card.Title>Card Title</Card.Title>
            <Card.Description>Card description</Card.Description>
          </Card.Header>
          <Card.Content>Card content</Card.Content>
          <Card.Footer>Card footer</Card.Footer>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Carousel</h2>
        <Carousel>
          <Carousel.Item>Slide 1</Carousel.Item>
          <Carousel.Item>Slide 2</Carousel.Item>
          <Carousel.Item>Slide 3</Carousel.Item>
        </Carousel>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Checkbox</h2>
        <Checkbox>Checkbox label</Checkbox>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Switch</h2>
        <Switch>Switch label</Switch>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Slider</h2>
        <Slider defaultValue={50} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Progress</h2>
        <Progress value={70} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Toast</h2>
        <Toast>Toast message</Toast>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Radio</h2>
        <Radio name="group1" value="option1">Option 1</Radio>
        <Radio name="group1" value="option2">Option 2</Radio>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Dialog</h2>
        <Dialog>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>Dialog description</Dialog.Description>
          <Dialog.Content>Dialog content</Dialog.Content>
          <Dialog.Actions>
            <Button variant="secondary">Cancel</Button>
            <Button>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">DropdownMenu</h2>
        <DropdownMenu
          trigger={<Button>Open Dropdown</Button>}
          items={[
            { label: 'Option 1', onClick: () => { } },
            { label: 'Option 2', onClick: () => { } },
            { label: 'Option 3', onClick: () => { } },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Breadcrumbs</h2>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ]}
        />
      </div>
    </div>

  );
}

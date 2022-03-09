import { globalShortcut } from 'electron';
import * as ks from 'node-key-sender';

class KeyWatcher {

  public key: string;

  constructor(key: string) {
    console.log('new')
    this.key = key;
  } 

  public regist(): void {
    globalShortcut.register(this.key, () => this.callback(this.key));
    console.log(this.key);
  }

  public callback(key: string): void {
    console.log('keydown ' + key);
    ks.sendKey('right');
  }
}

export default KeyWatcher;

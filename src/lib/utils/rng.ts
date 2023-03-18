export class Rng {
  private state: [number, number, number, number];

  constructor(seed?: number) {
    this.state = this.initializeState(seed);
  }

  private initializeState(input?: number): [number, number, number, number] {
    const primes = [15485863, 32452843, 49979687, 67867967];

    input =
      input != null ? Math.floor(input) : Math.floor(Math.random() * 10000);

    const state: [number, number, number, number] = [0, 0, 0, 0];

    for (let i = 0; i < primes.length; i++) {
      const prime = primes[i];
      const product = input * prime;
      state[0] ^= (product >>> 0) & 0xff;
      state[1] ^= (product >>> 8) & 0xff;
      state[2] ^= (product >>> 16) & 0xff;
      state[3] ^= (product >>> 24) & 0xff;
      input += 1; // wrap around if overflow occurs
    }

    return state;
  }

  public sample(): number {
    let [a, b, c, d] = this.state;

    const t = b << 9;
    let r = a * 5;
    r = ((r << 7) | (r >>> 25)) * 9;
    c ^= a;
    d ^= b;
    b ^= c;
    a ^= d;
    c ^= t;
    d = (d << 11) | (d >>> 21);
    this.state = [a, b, c, d];
    return (r >>> 0) / 4294967296;
  }

  public next({ min = 0, max }: { min?: number; max: number }): number {
    const range = max - min;
    const result = Math.floor(this.sample() * range) + min;
    return result;
  }

  public shuffle<T>(array: T[]): T[] {
    for (let i = 0; i < array.length; i++) {
      const idx = this.next({ max: array.length });
      const temp = array[i];
      array[i] = array[idx];
      array[idx] = temp;
    }
    return array;
  }
}

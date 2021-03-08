pub struct Random {
    start: u16,
}

impl Random {

    // Creates a new LFSR pseudo random generator from given seed
    pub fn new(seed: u16) -> Random {
        // Cannot use 0 as a seed
        Random { start: if seed == 0 {1} else {seed} }
    }

    // Generates a new pseudo random number in range [0, 1)
    pub fn next(&mut self) -> f32 {
        let mut next: u16 = self.start;
        let mut value;

        loop {
            value  = (next >> 0) ^ (next >> 2) ^ (next >> 3) ^ (next >> 5);
            next =  (next >> 1) | (value << 15);

            if next != self.start {
                // Cannot use 0 as a seed
                self.start = if next == 0 {1} else {next};
                return (value as f32) / u16::MAX as f32;
            }
        }
    }
}
import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// new jobs will be pushed to this array;
const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  // iniciamente para cada um do jobs cria uma filha e armazena o bee que contém a instancia com dados de conexão com o redis
  // e o meodo que handle que é o cara que processa a fila, seta as variáveis
  init() {
    // destructing to get direct access to the key and handle method of the job CancellationMail class
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // armazena o job na fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // processa o job em background
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name} failed:  ${err}`);
  }
}

export default new Queue();

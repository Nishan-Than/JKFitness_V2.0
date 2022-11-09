using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer
{
    public class GenericRepository<TEntity> where TEntity : class
    {
        internal DatabaseContext context;
        internal DbSet<TEntity> dbSet;

        public GenericRepository(DatabaseContext context)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();
        }

        public virtual IEnumerable<TEntity> GetAll()
        {
            return this.dbSet.ToList();
        }

        public virtual void Insert(TEntity entity)
        {
            this.dbSet.Add(entity);
        }

        public virtual TEntity GetByID(object id)
        {
            return dbSet.Find(id);
        }

        public virtual void Update(TEntity entityToUpdate)
        {
            dbSet.Attach(entityToUpdate);
            context.Entry(entityToUpdate).State = EntityState.Modified;
        }

        public virtual void Delete(TEntity entityToDelete)
        {
            if (context.Entry(entityToDelete).State == EntityState.Detached)
                dbSet.Attach(entityToDelete);

            dbSet.Remove(entityToDelete);
        }
        public virtual void DeleteRange(List<TEntity> entitiesToDelete)
        {
            foreach(var entityToDelete in entitiesToDelete)
            {
                if (context.Entry(entityToDelete).State == EntityState.Detached)
                    dbSet.Attach(entityToDelete);

                dbSet.Remove(entityToDelete);
            }
        }
    }
}

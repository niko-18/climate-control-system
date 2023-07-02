package com.example.server.repository;

import com.example.server.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {

    @Query("select m from Log m where (m.date between :date and :date2)")
    List<Log> getLogByDate(@Param("date") long date,
                           @Param("date2") long date2);

    @Query("select m from Log m where m.date = (select max(date) from Log)")
    Log getLastLog();
}
